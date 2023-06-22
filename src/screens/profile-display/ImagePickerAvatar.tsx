/* eslint-disable react/react-in-jsx-scope */
import UserAvatar from 'react-native-user-avatar';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {chatService} from '../../network/lib/message';
import {TouchableOpacity} from 'react-native';

interface ImagePickerAvatarProps {
  avatarUrl: string | undefined;
  imageName: string;
  onConfirm: (imageUrl: string) => void;
}

export const ImagePickerAvatar = (props: ImagePickerAvatarProps) => {
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

    // upload uri to server, get url of image
    const resp = await chatService.uploadImage(
      uri,
      `${props.imageName}_${Date.now()}`,
    );
    const imageUrl = resp.data;

    // image url 传给外层使用者处理
    props.onConfirm(imageUrl);
  };

  return (
    <TouchableOpacity onPress={onImageLibraryPress}>
      <UserAvatar bgColor="#fff" size={100} src={props.avatarUrl} />
    </TouchableOpacity>
  );
};
