import styles from './index.css';
import logo from '../assets/perfect-party.svg';

export default function() {
  return (
    <div className={styles.normal}>
      <img src={logo}/>
      <ul className={styles.list}>
        <li>To get started, press <code>New Event</code> to add an event.</li>
      </ul>
    </div>
  );
}
