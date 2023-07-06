/* eslint-disable react/react-in-jsx-scope */
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CircleImage from '../../components/CircleImage';
import {ImageUtil} from '../../utils/imageUtil';
import {imageService} from '../../network/lib/imageService';

/**
 * 选择头像的组件
 * @param pickerDisabled 是否禁用上传头像功能，如禁用，组件将不会响应点击事件
 * @param avatarUrl 默认展示的头像的 url
 * @param imageName 上传的头像图片的名字
 * @param onConfirm 上传头像成功后把头像的 url 传给外层使用者
 */
interface ImagePickerAvatarProps {
  pickerDisabled: boolean;
  avatarUrl: string | undefined;
  imageName: string;
  onConfirm: (imageUrl: string) => void;
}

export const ImagePickerAvatar = ({
  pickerDisabled,
  avatarUrl,
  imageName,
  onConfirm,
}: ImagePickerAvatarProps) => {
  const onImageLibraryPress = async () => {
    const uri = await ImageUtil.openSingleImageLibrary();
    if (!uri) {
      return;
    }

    const url = await imageService.uploadImage(
      uri,
      `${imageName}_${Date.now()}.jpg`,
      'avatar',
    );

    onConfirm(url);
  };

  return (
    <TouchableOpacity disabled={pickerDisabled} onPress={onImageLibraryPress}>
      <View style={styles.imageContainer}>
        <CircleImage avatarUrl={avatarUrl} />
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
