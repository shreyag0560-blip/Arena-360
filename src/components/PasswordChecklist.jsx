import { passwordRules } from '../utils/validators.js';

export default function PasswordChecklist({ password }) {
  return (
    <ul className="checklist" aria-live="polite">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.id} className={met ? 'met' : ''}>
            <span className="tick" aria-hidden="true">{met ? '\u2713' : '\u2022'}</span>
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
