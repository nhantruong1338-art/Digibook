import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconPauseMini = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M8.875 15.925V4.075C8.875 2.95 8.4 2.5 7.2 2.5H4.175c-1.2 0-1.675.45-1.675 1.575v11.85c0 1.125.475 1.575 1.675 1.575H7.2c1.2 0 1.675-.45 1.675-1.575ZM17.5 15.925V4.075c0-1.125-.475-1.575-1.675-1.575H12.8c-1.192 0-1.675.45-1.675 1.575v11.85c0 1.125.475 1.575 1.675 1.575h3.025c1.2 0 1.675-.45 1.675-1.575Z"
    />
  </Svg>
)
export default IconPauseMini
