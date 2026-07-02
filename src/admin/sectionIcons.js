import {
  FaAddressCard,
  FaImage,
  FaImages,
  FaBars,
  FaFont,
  FaChartSimple,
  FaDumbbell,
  FaStar,
  FaQuoteLeft,
  FaBullhorn,
  FaClock,
  FaCalendarDays,
  FaTags,
  FaLayerGroup,
} from 'react-icons/fa6'

/* Maps the `icon` names used in content/schema.js to components. */
const MAP = {
  FaAddressCard,
  FaImage,
  FaImages,
  FaBars,
  FaFont,
  FaChartSimple,
  FaDumbbell,
  FaStar,
  FaQuoteLeft,
  FaBullhorn,
  FaClock,
  FaCalendarDays,
  FaTags,
}

export function sectionIcon(name) {
  return MAP[name] || FaLayerGroup
}
