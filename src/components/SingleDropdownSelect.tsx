import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dropdown, IDropdownRef} from 'react-native-element-dropdown';
import {ISelectItem} from './MultiSelect';

interface ISingleSelectProps {
  data: ISelectItem[];
  defaultValue: string;
  onItemChange: (item: string) => void;
}

export const SingleDropdownSelect = ({
  data,
  defaultValue,
  onItemChange,
}: ISingleSelectProps) => {
  const [value, setValue] = useState<string>(defaultValue);
  const ref = useRef<IDropdownRef>(null);

  return (
    <View style={styles.row}>
      <Dropdown
        ref={ref}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Dropdown 2"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
          onItemChange(item.value);
        }}
        onChangeText={() => {}} // Keep search keyword
      />
    </View>
  );
};

export default SingleDropdownSelect;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    // margin: 16,
    marginBottom: 12,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  button: {
    marginHorizontal: 16,
  },
});
