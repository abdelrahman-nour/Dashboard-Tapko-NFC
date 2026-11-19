"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  FaArrowLeft,
  FaArrowUp,
  FaCheck,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
} from "react-icons/fa";

import { login } from "./actions";
import styles from "./login.module.css";

function Wordmark() {
  return (
    <span className={styles.wordmark} dir="ltr" aria-label="Tapko">
      tap<span>ko</span>
      <i aria-hidden="true" />
    </span>
  );
}

function LoginFields({ errorMessage }: { errorMessage?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const { pending } = useFormStatus();

  return (
    <>
      <fieldset disabled={pending} className={styles.fieldset}>
        <div className={styles.field}>
          <label htmlFor="email">البريد الإلكتروني</label>

          <div className={styles.inputWrap}>
            <FaEnvelope className={styles.inputIcon} aria-hidden="true" />

            <input
              id="email"
              name="email"
              type="email"
              dir="ltr"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@company.com"
              maxLength={254}
              required
              aria-describedby={errorMessage ? "login-error" : undefined}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="password">كلمة المرور</label>

          <div className={styles.inputWrap}>
            <FaLock className={styles.inputIcon} aria-hidden="true" />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              autoComplete="current-password"
              placeholder="أدخل كلمة المرور"
              required
              aria-describedby={errorMessage ? "login-error" : undefined}
            />

            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
              aria-pressed={showPassword}
              aria-controls="password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p id="login-error" role="alert" className={styles.error}>
            {errorMessage}
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={pending}>
          <span>
            {pending ? "جاري تسجيل الدخول..." : "الدخول لمساحة الإدارة"}
          </span>

          {pending ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            <FaArrowLeft aria-hidden="true" />
          )}
        </button>
      </fieldset>

      <span className={styles.srOnly} role="status">
        {pending ? "جاري التحقق من بيانات الدخول" : ""}
      </span>
    </>
  );
}

export default function LoginScreen({
  errorMessage,
}: {
  errorMessage?: string;
}) {
  return (
    <main className={styles.page} dir="rtl">
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <header className={styles.header}>
        <Wordmark />

        <span className={styles.headerLabel} dir="ltr">
          BUSINESS WORKSPACE
        </span>
      </header>

      <div className={styles.layout}>
        <section className={styles.story} aria-labelledby="story-title">
          <p className={styles.eyebrow}>
            <span />
            مساحة واحدة. إمكانيات أكتر.
          </p>

          <h1 id="story-title">
            كل اتصال،
            <br />
            بداية <span>لفرصة.</span>
          </h1>

          <p className={styles.storyDescription}>
            من أول لمسة لآخر تحديث، خلّي حضور عملائك متصل.
            <br />
            أدِر صفحاتهم وروابطهم من مساحة معمولة عشانك.
          </p>

          <div className={styles.preview} aria-hidden="true">
            <div className={styles.previewTop}>
              <span dir="ltr">YOUR BUSINESS, CONNECTED</span>

              <span className={styles.liveDot} />
            </div>

            <div className={styles.previewIdentity}>
              <div className={styles.previewAvatar} dir="ltr">
                tk<span>.</span>
              </div>

              <div>
                <strong>حضور أذكى لعلامتك</strong>
                <p>صفحة واحدة تربط كل التفاصيل</p>
              </div>

              <span className={styles.previewArrow}>
                <FaArrowUp />
              </span>
            </div>

            <div className={styles.previewLinks}>
              <span>تواصل</span>
              <span>اكتشف</span>
              <span>شارك</span>
            </div>

            <div className={styles.previewBottom}>
              <span>
                <FaCheck />
                جاهزة للاتصال
              </span>

              <span dir="ltr">Powered by tapko</span>
            </div>
          </div>

          <p className={styles.storyFootnote} dir="ltr">
            LESS FRICTION. MORE CONNECTION.
          </p>
        </section>

        <section className={styles.card} aria-labelledby="login-title">
          <div className={styles.cardTop}>
            <span className={styles.lockBadge}>
              <FaLock aria-hidden="true" />
            </span>

            <span className={styles.cardLabel} dir="ltr">
              ADMIN ACCESS
            </span>
          </div>

          <div className={styles.intro}>
            <p className={styles.welcome}>مساحتك جاهزة</p>

            <h2 id="login-title">أهلًا برجوعك.</h2>

            <p>سجّل دخولك، وكمّل من مكان ما وقفت.</p>
          </div>

          <form action={login} className={styles.form}>
            <LoginFields errorMessage={errorMessage} />
          </form>

          <div className={styles.cardFooter}>
            <FaLock aria-hidden="true" />
            <span>مساحة خاصة بفريق إدارة Tapko</span>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        <span dir="ltr">Tapko · Smart Business Solution</span>
        <span>تفاصيل أقل. تحكّم أكتر.</span>
      </footer>
    </main>
  );
}
