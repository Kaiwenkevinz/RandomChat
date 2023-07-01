import React from 'react';
import {StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

interface DropdownProps {
  onValueChange: (value: string) => void;
  items: {label: string; value: string}[];
  value: string;
}

export const Dropdown = (props: DropdownProps) => {
  const {onValueChange, items, value} = props;

  return (
    <RNPickerSelect
      style={pickerSelectStyles}
      onValueChange={v => {
        onValueChange(v);
      }}
      value={value}
      items={items}
    />
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  inputAndroid: {
    height: 50,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  placeholder: {
    color: '#9EA0A4',
    fontWeight: 'bold',
  },
});
