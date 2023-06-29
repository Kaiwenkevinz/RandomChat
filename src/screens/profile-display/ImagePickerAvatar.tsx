/* eslint-disable react/react-in-jsx-scope */
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {chatService} from '../../network/lib/message';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CircleImage from '../../components/CircleImage';

interface ImagePickerAvatarProps {
  pickerDisabled: boolean;
  avatarUrl: string | undefined;
  imageName: string;
  onConfirm: (imageUrl: string) => void;
}

export const ImagePickerAvatar = (props: ImagePickerAvatarProps) => {
  // TODO: 选择图片的逻辑可以抽取出来
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

    const url = await chatService.uploadImage(
      uri,
      `${props.imageName}_${Date.now()}.jpg`,
      'avatar',
    );

    // image url 传给外层使用者处理
    props.onConfirm(url);
  };

  return (
    <TouchableOpacity
      disabled={props.pickerDisabled}
      onPress={onImageLibraryPress}>
      <View style={styles.imageContainer}>
        <CircleImage avatarUrl={props.avatarUrl} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
