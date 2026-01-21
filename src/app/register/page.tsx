import Link from "next/link";
import Image from "next/image";
import "./page.scss";

export default function RegisterPage() {
  return (
    <div className="register-page-container">
      <div className="left-container">
        <Image src="/images/abricot.png" alt="Logo Abricot" width={252} height={32} />
        <div className="form-container">
          <h1>Inscription</h1>
          <form>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-field">
              <label htmlFor="password">Mot de passe</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">S&apos;inscrire</button>
          </form>
        </div>
        <div className="already-account">
          <p>Déjà inscrit ?</p>
          <Link href="/login">Se connecter</Link>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
}
