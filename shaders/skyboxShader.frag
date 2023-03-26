#version 410 core

in vec3 textureCoordinates;

//added stuff
//vec3 viewDirection;/
//in vec3 normal;
//in vec4 fPosEye;
//out vec3 colorFromSkybox;

out vec4 color;


uniform samplerCube skybox;

void main()
{
    color = texture(skybox, textureCoordinates);

    //added stuff
    //vec3 cameraPoz = vec3(0.0f);
    //vec3 viewDirectionN = normalize(cameraPoz - fPosEye.xyz);
    //vec3 normalN = normalize(normal);
    //vec3 reflection = reflect(viewDirectionN, normalN);
    //vec3 colorFromSkybox = vec3(texture(skybox, reflection));
    
    //vec4 colorFromSkybox = texture(skybox, reflection);
}
