import Image from 'next/image';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className='footer-component'>
      <Image src="/images/logo-footer.png" alt="Logo Abricot footer" width={101} height={12} />
      <p>Abricot {new Date().getFullYear()}</p>
    </footer>
  );
}
