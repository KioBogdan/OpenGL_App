#include "Camera.hpp"
#include <glm/gtx/euler_angles.hpp>

namespace gps {

    //Camera constructor
    Camera::Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp) {
        this->cameraPosition = cameraPosition;
        this->cameraTarget = cameraTarget;
        this->cameraUpDirection = cameraUp;

        //TODO - Update the rest of camera parameters
        this->cameraFrontDirection = glm::normalize(cameraTarget - cameraPosition);
        this->cameraRightDirection = -glm::normalize(glm::cross(cameraUp, cameraFrontDirection));
        //retinere parametru original cameraUp pentru evitarea dependentelor nedorite in calcule
        this->cameraOrigUp = cameraUp;
        //asigurare valoare cameraUp
        this->cameraUpDirection = glm::cross(cameraRightDirection, cameraFrontDirection);
        //retinere parametru original cameraFrontDirection pentru evitarea dependentelor nedorite in calcule
        this->cameraOrigFront = cameraFrontDirection;
    }

    //return the view matrix, using the glm::lookAt() function
    glm::mat4 Camera::getViewMatrix() {
        return glm::lookAt(cameraPosition, cameraTarget, cameraUpDirection);
    }

    //update the camera internal parameters following a camera move event
    void Camera::move(MOVE_DIRECTION direction, float speed) {
        switch (direction)
        {
            case(MOVE_FORWARD):
                cameraPosition = cameraPosition + speed * cameraFrontDirection;
                break;
            
            case(MOVE_BACKWARD):
                cameraPosition = cameraPosition + speed * -cameraFrontDirection;
                break;

            case(MOVE_LEFT):
                cameraPosition = cameraPosition + speed * -cameraRightDirection;
                break;

            case(MOVE_RIGHT):
                cameraPosition = cameraPosition + speed * cameraRightDirection;
                break;
            default:
                break;
        }
        //actualizare cameraTarget
        cameraTarget = cameraPosition + cameraFrontDirection;
    }

    //update the camera internal parameters following a camera rotate event
    //yaw - camera rotation around the y axis
    //pitch - camera rotation around the x axis
    void Camera::rotate(float pitch, float yaw) {
        glm::mat4 eulerAngle = glm::yawPitchRoll(glm::radians(yaw), glm::radians(pitch), 0.0f);

        cameraFrontDirection = glm::vec3(glm::normalize((eulerAngle * glm::vec4(cameraOrigFront, 0.0f))));
        cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, cameraOrigUp));
        cameraUpDirection = glm::cross(cameraRightDirection, cameraFrontDirection);
        //actualizare cameraTarget
        cameraTarget = cameraPosition + cameraFrontDirection;
    }
}