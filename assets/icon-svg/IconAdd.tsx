import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconAdd = (props: SvgProps) => (
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
      fill="#fff"
      d="M30 24.75H18c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h12c.41 0 .75.34.75.75s-.34.75-.75.75Z"
    />
    <Path
      fill="#fff"
      d="M24 30.75c-.41 0-.75-.34-.75-.75V18c0-.41.34-.75.75-.75s.75.34.75.75v12c0 .41-.34.75-.75.75Z"
    />
  </Svg>
)
export default IconAdd
