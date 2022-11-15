interface LogoSvgProps {
  width: number;
  height: number;
}

export default function LogoSvg(props: LogoSvgProps) {
  return (
    <svg width={props.width} height={props.height} viewBox={`0 0 56 56`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.2" d="M48.9999 26.25C47.2936 33.0531 42.6561 33.425 40.928 33.3375C41.9441 34.1875 42.7293 35.2801 43.2109 36.5142C43.6926 37.7483 43.8551 39.0839 43.6836 40.3974C43.512 41.711 43.0118 42.9601 42.2293 44.029C41.4469 45.0979 40.4074 45.9522 39.2071 46.5128C38.0068 47.0733 36.6845 47.322 35.3626 47.2358C34.0407 47.1496 32.7619 46.7314 31.6445 46.0197C30.5272 45.3081 29.6074 44.3261 28.9703 43.1646C28.3332 42.0032 27.9995 40.6997 27.9999 39.375C28.0003 40.6997 27.6665 42.0032 27.0295 43.1646C26.3924 44.3261 25.4726 45.3081 24.3553 46.0197C23.2379 46.7314 21.9591 47.1496 20.6372 47.2358C19.3153 47.322 17.993 47.0733 16.7927 46.5128C15.5924 45.9522 14.5529 45.0979 13.7704 44.029C12.988 42.9601 12.4878 41.711 12.3162 40.3974C12.1447 39.0839 12.3072 37.7483 12.7889 36.5142C13.2705 35.2801 14.0557 34.1875 15.0718 33.3375C13.3436 33.425 8.70615 33.0531 6.9999 26.25C5.29365 19.4469 3.74052 10.5 10.4999 10.5C17.2593 10.5 27.9999 21 27.9999 28C27.9999 21 38.7405 10.5 45.4999 10.5C52.2593 10.5 50.7499 19.25 48.9999 26.25Z" fill="#3d5183" />
      <path d="M28 12.25V39.375" stroke="#264EB5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40.9281 33.3375C42.6562 33.425 47.2937 33.0531 49 26.25C50.7062 19.4469 52.2594 10.5 45.5 10.5C38.7406 10.5 28 21 28 28C28 21 17.2594 10.5 10.5 10.5C3.7406 10.5 5.24998 19.25 6.99998 26.25C8.74998 33.25 13.3437 33.425 15.0719 33.3375" stroke="#264EB5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.25 31.5437C17.7394 31.7126 16.31 32.315 15.1342 33.2783C13.9584 34.2416 13.0866 35.5246 12.6238 36.9725C12.1611 38.4203 12.1272 39.9711 12.5263 41.4378C12.9255 42.9044 13.7405 44.2243 14.8731 45.2379C16.0057 46.2516 17.4075 46.9159 18.9093 47.1505C20.4111 47.3852 21.9487 47.1802 23.3365 46.5603C24.7244 45.9405 25.9032 44.9322 26.7307 43.6572C27.5582 42.3822 27.999 40.8949 28 39.375C28.001 40.8949 28.4418 42.3822 29.2693 43.6572C30.0968 44.9322 31.2756 45.9405 32.6635 46.5603C34.0513 47.1802 35.5889 47.3852 37.0907 47.1505C38.5925 46.9159 39.9943 46.2516 41.1269 45.2379C42.2595 44.2243 43.0745 42.9044 43.4737 41.4378C43.8728 39.9711 43.8389 38.4203 43.3762 36.9725C42.9134 35.5246 42.0416 34.2416 40.8658 33.2783C39.69 32.315 38.2606 31.7126 36.75 31.5437" stroke="#264EB5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}