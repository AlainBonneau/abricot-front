import Image from 'next/image';
import Link from 'next/link';
import './page.scss';

export default function LoginPage() {
  return (
    <div className="login-page-container">
      <div className="left-container">
        <Image src="/images/abricot.png" alt="Logo Abricot" width={252} height={32} />
        <div className="form-container">
          <h1>Connexion</h1>
          <form>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="password">Mot de passe</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Se connecter</button>
            <Link href="/forgot-password">Mot de passe oublié ?</Link>
          </form>
        </div>
        <div className="create-account">
          <p>Pas encore de compte ?</p>
          <Link href="/register">Créer un compte</Link>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
