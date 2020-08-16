"""
detect face
"""
import cv2
import numpy as np
# to detect face key point
import dlib

DETECTOR = dlib.get_frontal_face_detector()
# 人脸模型数据
PREDICTOR = dlib.shape_predictor(
    './data/shape_predictor_68_face_landmarks.dat')


def face_positioning(img):
    """
    定位人脸
    计算最大面积
    """
    dets = DETECTOR(img, 0)
    if not dets:
        return None
    return max(dets, key=lambda det: (det.right() - det.left()) * (det.bottom() - det.top()))


def extract_key_points(img, position):
    """
    提取关键点
    """
    landmark_shape = PREDICTOR(img, position)
    key_points = []
    for i in range(68):
        pos = landmark_shape.part(i)
        key_points.append(np.array([pos.x, pos.y], dtype=np.float32))
    return key_points


def generate_points(key_points):
    """
    生成构造点
    """
    def center(array):
        return sum([key_points[i] for i in array]) / len(array)
    left_brow = [18, 19, 20, 21]
    right_brow = [22, 23, 24, 25]
    # 下巴
    chin = [6, 7, 8, 9, 10]
    nose = [29, 30]
    return center(left_brow + right_brow), center(chin), center(nose)


def generate_features(contruction_points):
    """
    生成特征
    """
    brow_center, chin_center, nose_center = contruction_points
    mid_edge = brow_center - chin_center
    # 斜边
    bevel_edge = brow_center - nose_center
    mid_edge_length = np.linalg.norm(mid_edge)
    # 高与底的比值
    horizontal_rotation = np.cross(
        mid_edge, bevel_edge) / mid_edge_length ** 2
    # @ 点乘
    vertical_rotation = mid_edge @ bevel_edge / mid_edge_length**2
    return np.array([horizontal_rotation, vertical_rotation])


def draw_image(h_rotation, v_rotation):
    """
    画脸

    Args:
        h_rotation: 水平旋转量
        v_rotation: 垂直旋转量
    """
    img = np.ones([512, 512], dtype=np.float32)
    face_length = 200
    center = 256, 256
    left_eye = int(220 + h_rotation *
                   face_length), int(249 + v_rotation * face_length)
    right_eye = int(292 + h_rotation *
                    face_length), int(249 + v_rotation * face_length)
    month = int(256 + h_rotation * face_length /
                2), int(310 + v_rotation * face_length / 2)
    cv2.circle(img, center, 100, 0, 1)
    cv2.circle(img, left_eye, 15, 0, 1)
    cv2.circle(img, right_eye, 15, 0, 1)
    cv2.circle(img, month, 5, 0, 1)
    return img


def extract_img_features(img):
    """
    提取图片特征
    """
    face_position = face_positioning(img)
    if not face_position:
        cv2.imshow('self', img)
        cv2.waitKey(1)
        return None
    key_points = extract_key_points(img, face_position)
    for i, (p_x, p_y) in enumerate(key_points):
        cv2.putText(img, str(i), (int(p_x), int(p_y)),
                    cv2.FONT_HERSHEY_COMPLEX, 0.25, (255, 255, 255))
    construction_points = generate_points(key_points)
    for i, (p_x, p_y) in enumerate(construction_points):
        cv2.putText(img, str(i), (int(p_x), int(p_y)),
                    cv2.FONT_HERSHEY_COMPLEX, 0.25, (255, 255, 255))
    rotation = generate_features(construction_points)
    cv2.putText(img, str(rotation),
                (int(construction_points[-1][0]),
                 int(construction_points[-1][1])),
                cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255))
    cv2.imshow('self', img)
    return rotation


if __name__ == '__main__':
    CAP = cv2.VideoCapture(0)
    # 原点特征组 my front side
    ORIGIN_FEATURE_GROUP = [-0.00899233, 0.39529446]
    FEATURE_GROUP = [0, 0]
    while True:
        RETVAL, IMAGE = CAP.read()
        # 翻转视频
        IMAGE = cv2.flip(IMAGE, 1)
        NEW_FEATURE_GROUP = extract_img_features(IMAGE)
        if NEW_FEATURE_GROUP is not None:
            FEATURE_GROUP = NEW_FEATURE_GROUP - ORIGIN_FEATURE_GROUP
        HORI_ROTATION, VERT_ROTATION = FEATURE_GROUP
        cv2.imshow('Vtuber', draw_image(HORI_ROTATION, VERT_ROTATION))

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("close")
            break
