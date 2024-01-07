import React from 'react';
import { useCallback } from 'react';
import Button from '../Button/Button';
import styles from './Header.module.scss';

export const Header = () => {
  const myNameButton = useCallback( 
    () => {
      window.open('https://github.com/KamilT23', '_blank', 'noopener,noreferrer')
    }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <h1 className={styles.logo}>Каталог фильмов</h1>
        <Button onClick={myNameButton}>6407 Таджитдинов Камиль</Button>
      </div>
    </header>
  );
};
