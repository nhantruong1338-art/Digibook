import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconBack = (props: SvgProps) => (
  <Svg
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <Path
      fill="#919EAB"
      fillOpacity={0.24}
      d="M0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24Z"
    />
    <Path
      fill="#212B36"
      d="M21.57 30.82c-.19 0-.38-.07-.53-.22l-6.07-6.07a.754.754 0 0 1 0-1.06l6.07-6.07c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06L16.56 24l5.54 5.54c.29.29.29.77 0 1.06-.14.15-.34.22-.53.22Z"
    />
    <Path
      fill="#212B36"
      d="M32.5 24.75H15.67c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H32.5c.41 0 .75.34.75.75s-.34.75-.75.75Z"
    />
  </Svg>
)
export default IconBack
