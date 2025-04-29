import { Lucide } from "@telegraph/icon";
import {
  FaNodeJs,
  FaPython,
  FaJava,
  FaPhp,
  FaReact,
  FaSwift,
  FaAngular,
  FaApple,
  FaAndroid,
} from "react-icons/fa";
import { RiJavascriptFill } from "react-icons/ri";

// Combine all the icons into a single object
// This is mostly for MDX so we can enable our components to accept a string
// and then we can do "icons[iconName]" and pass that to render in the component
export const Icons = {
  Logo: () => (
    <svg viewBox="0 0 584 584" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M131.083 3H452.917C523.655 3.00008 581 60.3448 581 131.083V452.917C581 523.655 523.655 581 452.917 581H131.083C60.3448 581 3.00007 523.655 3 452.917V131.083C3.00007 60.8973 59.4523 3.89706 129.428 3.01074L131.083 3Z"
        fill="#262626"
        stroke="white"
        strokeWidth="6"
      />
      <path
        d="M176.75 488V102.45H255.4V323.55H257.6L343.95 215.2H431.95L336.25 327.4L439.1 488H351.65L290.05 381.85L255.4 420.9V488H176.75Z"
        fill="#EEE6DA"
      />
      <path
        d="M433 148.5C433 174.734 411.734 196 385.5 196C359.266 196 338 174.734 338 148.5C338 122.266 359.266 101 385.5 101C411.734 101 433 122.266 433 148.5Z"
        fill="#E95744"
      />
    </svg>
  ),
  YoutubeColor: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 461.001 461.001">
      <path
        d="M365.257 67.393H95.744C42.866 67.393 0 110.259 0 163.137v134.728c0 52.878 42.866 95.744 95.744 95.744h269.513c52.878 0 95.744-42.866 95.744-95.744V163.137c0-52.878-42.866-95.744-95.744-95.744zm-64.751 169.663-126.06 60.123c-3.359 1.602-7.239-.847-7.239-4.568V168.607c0-3.774 3.982-6.22 7.348-4.514l126.06 63.881c3.748 1.899 3.683 7.274-.109 9.082z"
        style={{ fill: "#f61c0d" }}
      />
    </svg>
  ),
  Javascript: () => (
    <RiJavascriptFill style={{ width: "100%", height: "100%" }} />
  ),
  Node: () => <FaNodeJs style={{ width: "100%", height: "100%" }} />,
  Python: () => <FaPython style={{ width: "100%", height: "100%" }} />,
  Java: () => <FaJava style={{ width: "100%", height: "100%" }} />,
  Php: () => <FaPhp style={{ width: "100%", height: "100%" }} />,
  React: () => <FaReact style={{ width: "100%", height: "100%" }} />,
  Swift: () => <FaSwift style={{ width: "100%", height: "100%" }} />,
  Angular: () => <FaAngular style={{ width: "100%", height: "100%" }} />,
  Ios: () => <FaApple style={{ width: "100%", height: "100%" }} />,
  Android: () => <FaAndroid style={{ width: "100%", height: "100%" }} />,
  ...Lucide,
};
