import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconTick = (props: SvgProps) => (
  <Svg
    width={19}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#EC38BC"
      d="M14.694 4.176a.75.75 0 0 1 1.056 1.055l-.052.057-7.955 7.955a.75.75 0 0 1-1.061 0L2.97 9.531l-.052-.057A.75.75 0 0 1 4.03 8.47l3.182 3.181 7.426-7.423.056-.052Z"
    />
  </Svg>
)
export default IconTick
