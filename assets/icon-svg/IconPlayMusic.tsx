import * as React from "react"
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg"
const IconPlayMusic = (props: SvgProps) => (
  <Svg
    width={56}
    height={56}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M0 28C0 12.536 12.536 0 28 0s28 12.536 28 28-12.536 28-28 28S0 43.464 0 28Z"
    />
    <Path
      stroke="#fff"
      strokeOpacity={0.16}
      d="M28 .5C43.188.5 55.5 12.812 55.5 28S43.188 55.5 28 55.5.5 43.188.5 28 12.812.5 28 .5Z"
    />
    <Path
      fill="#fff"
      d="M34.49 25.6 22.6 32.77c-.7.42-1.6-.08-1.6-.9v-8c0-3.49 3.77-5.67 6.8-3.93l4.59 2.64 2.09 1.2c.69.41.7 1.41.01 1.82ZM35.09 31.46l-4.05 2.34L27 36.13c-1.45.83-3.09.66-4.28-.18-.58-.4-.51-1.29.1-1.65l12.71-7.62c.6-.36 1.39-.02 1.5.67.25 1.55-.39 3.22-1.94 4.11Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={10.95}
        x2={59.196}
        y1={0}
        y2={27.569}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#EC38BC" />
        <Stop offset={0.9} stopColor="#831FE0" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default IconPlayMusic
