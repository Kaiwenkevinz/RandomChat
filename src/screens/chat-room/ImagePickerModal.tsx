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
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {chatService} from '../../network/lib/message';

interface ImagePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirmImage: (imageUrl: string) => void;
  imageName: string;
}
const ImagePickerModal = (props: ImagePickerModalProps) => {
  const onImageLibraryPress = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    } as ImageLibraryOptions;

    const result = await launchImageLibrary(options);
    if (result.didCancel || !result.assets || result.assets.length === 0) {
      console.log('用户取消了图片选择, 原因: ', result.errorCode);

      return;
    }

    let uri = result.assets[0].uri;
    if (uri === undefined) {
      uri = '';
      console.log('uri is undefined, 不应该 happen');
    }

    props.onClose();

    // upload uri to server, get url of image
    const resp = await chatService.uploadImage(uri, `imageName_${Date.now()}`);
    const imageUrl = resp.data;

    // image url 传给外层使用者处理
    props.onConfirmImage(imageUrl);
  };

  const onCameraPress = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    } as ImageLibraryOptions;

    const result = await launchCamera(options);
    console.log('🚀 ~ file: ChatRoom.tsx:59 ~ onCameraPress ~ result:', result);
    if (result.didCancel || !result.assets || result.assets.length === 0) {
      console.log('用户取消了照相机, 原因: ', result.errorCode);

      return;
    }

    let uri = result.assets[0].uri;
    if (uri === undefined) {
      uri = '';
      console.log('uri is undefined, 不应该 happen');
    }

    // TODO: 照相机拍照后, 上传到服务器
  };

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
          <Pressable style={styles.button} onPress={onImageLibraryPress}>
            <Image style={styles.buttonIcon} source={images.photos} />
            <Text style={styles.buttonText}>Library</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={onCameraPress}>
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
