#version 410 core

in vec3 fPositionEye;
in vec3 fNormal;
in vec2 fTexCoords;
in vec4 fragPosLightSpace;

out vec4 fColor;

//matrices
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
//lighting
uniform vec3 lightDir;
uniform vec3 lightColor;
// textures
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;

//import the shadow map
uniform sampler2D shadowMap;
//cube map
uniform samplerCube skybox;

//components
vec3 ambient;
float ambientStrength = 0.2f;
vec3 diffuse;
vec3 specular;
vec3 reflection;
vec4 Skyboxcolor;
float specularStrength = 0.5f;
float shininess = 32.0f;
float shadow = 0.0f;

void computeDirLight()
{
    //compute eye space coordinates
    vec4 fPosEye = view * model * vec4(fPositionEye, 1.0f);
    vec3 normalEye = normalize(normalMatrix * fNormal);

    //normalize light direction
    vec3 lightDirN = vec3(normalize(view * vec4(lightDir, 0.0f)));

    //compute view direction (in eye coordinates, the viewer is situated at the origin
    vec3 viewDir = normalize(- fPosEye.xyz);

    //compute ambient light
    ambient = ambientStrength * lightColor;

    //compute diffuse light
    diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor;

    //compute specular light
    vec3 reflectDir = reflect(-lightDirN, normalEye);
    float specCoeff = pow(max(dot(viewDir, reflectDir), 0.0f), 32);
    specular = specularStrength * specCoeff * lightColor;
}

float computeShadow() {
    //perform perspective divide
	//return position of the current fragment in [-1,1]
	vec3 normalizedCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;

	//transform to [0,1] range
	normalizedCoords = normalizedCoords * 0.5 + 0.5;
	if (normalizedCoords.z > 1.0f) {
		return 0.0f;
	}

	// Get closest depth value from light's perspective
	float closestDepth = texture(shadowMap, normalizedCoords.xy).r;
	float currentDepth = normalizedCoords.z;

	// Check whether current frag pos is in shadow
	float bias = 0.005f;
	float shadow = currentDepth - bias > closestDepth ? 1.0f : 0.0f;

	//float shadow = currentDepth > closestDepth ? 1.0 : 0.0;

	return shadow;
}

float computeFog()
{
     float fogDensity = 0.05f;
     float fragmentDistance = length(fPositionEye);
     float fogFactor = exp(-pow(fragmentDistance * fogDensity, 2));
 
     return clamp(fogFactor, 0.0f, 1.0f);
}

void main() 
{
    computeDirLight();

    shadow = computeShadow();

    ambient *=  texture(diffuseTexture, fTexCoords).rgb;
    diffuse *=  texture(diffuseTexture, fTexCoords).rgb;
    specular *=  texture(diffuseTexture, fTexCoords).rgb;

    Skyboxcolor = texture(skybox, reflection);

    float fogFactor = computeFog();
    vec4 fogColor = vec4(0.5f, 0.5f, 0.5f, 1.0f);
    //fColor = mix(fogColor, color, fogFactor);
    //compute final vertex color
    //vec3 color = min((ambient + diffuse) * texture(diffuseTexture, fTexCoords).rgb + specular * texture(specularTexture, fTexCoords).rgb, 1.0f);
    vec3 color = min((ambient + (1.0f - shadow) * diffuse) + (1.0f - shadow) * specular, 1.0f);
    //fColor = mix(fogColor, vec4(color, 1.0f), fogFactor);
    //fColor = Skyboxcolor;
    fColor = vec4(color, 1.0f);
    //vec4 colorFromTexture = texture(diffuseTexture, fTexCoords);
    //if(colorFromTexture.a < 0.1)
    //    discard;
    //fColor = mix(colorFromTexture, vec4(color,1.0f), 1.5);
}
