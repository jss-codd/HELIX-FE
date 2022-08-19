import React from "react";
import { Slider } from "antd";

const DateSlider = ({ start, end, step = 1, onChange }) => {
  const start_date = new Date(start);
  const number_of_date = Math.round(
    (new Date(end) - start_date) / (1000 * 60 * 60 * 24)
  );

  const onSliderChange = (values) => {
    const new_date = new Date(start);
    new_date.setDate(new_date.getDate() + values[0]);
    const start_string = new_date.toLocaleDateString();
    new_date.setDate(new_date.getDate() + values[1] - values[0]);
    const end_string = new_date.toLocaleDateString();
    onChange && onChange([start_string, end_string]);
  };

  const formatter = (value) => {
    const new_date = new Date(start);
    new_date.setDate(new_date.getDate() + value);
    return new_date.toLocaleDateString();
  };
  return (
    <Slider
      min={0}
      max={number_of_date}
      range
      defaultValue={[0, number_of_date]}
      tipFormatter={formatter}
      onChange={onSliderChange}
    />
  );
};

export default DateSlider;
