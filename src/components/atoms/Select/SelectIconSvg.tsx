export default function SelectIconSvg() {
  return (
    <svg className="select__iconOpen" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#4a63a3" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="none"></rect>
      <circle cx="128" cy="128" r="96" opacity="0.2"></circle>
      <polyline
        points="164 116 128 156 92 116"
        fill="none"
        stroke="#4a63a3"
        id="arrow"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      ></polyline>
    </svg>
  );
}
