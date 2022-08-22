import React, { useEffect, useState, useRef } from "react";
import { Alert, StyleSheet, View, TouchableOpacity } from "react-native";
import {
  Camera,
  CameraType,
  requestCameraPermissionsAsync,
  requestMicrophonePermissionsAsync,
  getCameraPermissionsAsync,
  getMicrophonePermissionsAsync,
} from "expo-camera";
import Feather from "@expo/vector-icons/Feather";

export default () => {
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState("off");
  const [pictureUri, setPictureUri] = useState("");
  const cameraRef = useRef();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    await requestCameraPermissionsAsync();
    await requestMicrophonePermissionsAsync();
  };

  const getPermissions = async () => {
    const cameraPermission = await getCameraPermissionsAsync();
    const microphonePermission = await getMicrophonePermissionsAsync();

    return cameraPermission.granted && microphonePermission.granted;
  };

  const switchFlashMode = () =>
    setFlashMode(flashMode === "off" ? "on" : "off");

  const switchType = () =>
    setType(type === CameraType.back ? CameraType.front : CameraType.back);

  const takePicture = async () => {
    const { uri, width, height } = await cameraRef?.current.takePictureAsync();
    setPictureUri(uri);
  };

  if (!getPermissions()) {
    return Alert.alert(
      "Permissions Required!",
      "You need to provide the permissions to access the camera",
      [{ text: "Got it" }]
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={type}
        flashMode={flashMode}
      >
        <View style={styles.controlsContainer}>
          <Feather name="refresh-ccw" size={30} onPress={switchType} />
          <TouchableOpacity
            style={styles.takePictureButton}
            onPress={takePicture}
          />
          <Feather
            name={flashMode === "off" ? "zap-off" : "zap"}
            size={30}
            onPress={switchFlashMode}
          />
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    alignItems: "center",
    backgroundColor: "lightblue",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    left: 0,
    position: "absolute",
    right: 0,
  },
  takePictureButton: {
    backgroundColor: "#fff",
    borderRadius: 35,
    height: 70,
    marginVertical: 10,
    width: 70,
  },
});
