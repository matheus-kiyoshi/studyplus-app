import Image from 'next/image'
import studypluslogo from '@/../public/studyplus-logo.jpeg'

export default function SitemarkIcon() {
  return (
    <Image
      alt="Logo"
      src={studypluslogo}
      height={21}
      width={100}
      className="mr-2"
    />
  )
}
