#version 410 core

layout (location = 0) in vec3 vertexPosition;
//layout (location = 1) in vec3 normalPosition;
out vec3 textureCoordinates;
//added stuff
//out vec4 fPosEye;
//out vec3 normal;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

void main()
{   
    //added stuff
    //viewDirection
    //fPosEye = view * model * vec4(vertexPosition, 1.0);
    vec4 tempPos = projection * view * vec4(vertexPosition, 1.0);
    gl_Position = tempPos.xyww;
    //normal = normalPosition;
    textureCoordinates = vertexPosition;
}
