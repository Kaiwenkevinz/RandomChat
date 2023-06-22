import {
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import images from '../../../assets';

interface ImagePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onImageLibraryPress: () => void;
  onCameraPress: () => void;
}
const ImagePickerModal = (props: ImagePickerModalProps) => {
  return (
    <Modal
      visible={props.isVisible}
      onRequestClose={props.onClose}
      animationType="slide"
      transparent={true}>
      <SafeAreaView style={styles.bottomView}>
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <SafeAreaView style={styles.modalView}>
          <Pressable style={styles.button} onPress={props.onImageLibraryPress}>
            <Image style={styles.buttonIcon} source={images.photos} />
            <Text style={styles.buttonText}>Library</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={props.onCameraPress}>
            <Image style={styles.buttonIcon} source={images.camera} />
            <Text style={styles.buttonText}>Camera</Text>
          </Pressable>
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  buttonIcon: {
    width: 30,
    height: 30,
    margin: 10,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ImagePickerModal;
