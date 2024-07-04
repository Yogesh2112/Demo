import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useRange } from "react-instantsearch";
import { useEffect, useState } from "react";

export default function RangeSlider(props) {
  const { start, range, canRefine, refine } = useRange(props);

  const { min, max } = range;
  const [value, setValue] = useState([min, max]);

  const from = Math.max(min, Number.isFinite(start[0]) ? start[0] : min);
  const to = Math.min(max, Number.isFinite(start[1]) ? start[1] : max);

  useEffect(() => {
    setValue([from, to]);
  }, [from, to]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeCommitted = (event, newValue) => {
    refine(newValue);
  };

  return (
    <Box sx={{ width: "100%", textAlign: 'center' }}>
      <div>
        <span>Min: {min}</span> | <span>Max: {max}</span>
      </div>
      <Slider
        getAriaLabel={() => "Range"}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        onChangeCommitted={handleChangeCommitted}
        disabled={!canRefine}
      />
      <div>
        <span>Selected Range: {value[0]} - {value[1]}</span>
      </div>
    </Box>
  );
}
