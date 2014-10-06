DROP TABLE FORUMTITLE;
DROP TABLE FORUMSUBTITLE;
DROP TABLE POSTMESSAGE;
DROP TABLE USERS;
DROP TABLE TOPMENU;
DROP TABLE SIDEMENU;
DROP TABLE HOME;

CREATE TABLE FORUMTITLE (
    ID NUMBER NOT NULL AUTO_INCREMENT,
    TITLE VARCHAR NOT NULL,
    ACCESSRIGHTS VARCHAR NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE FORUMSUBTITLE (
    ID NUMBER NOT NULL AUTO_INCREMENT,
    SUBTITLE VARCHAR NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE POSTMESSAGE (
    ID NUMBER NOT NULL AUTO_INCREMENT,
    MESSAGE VARCHAR NOT NULL,
    USERNAME VARCHAR NOT NULL,
    CREATIONTIME TIME NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE USERS (
    ID NUMBER NOT NULL AUTO_INCREMENT,
    USERNAME VARCHAR NOT NULL,
    PASSWORD VARCHAR NOT NULL,
    EMAIL VARCHAR NOT NULL,
    CREATIONDATE DATE NOT NULL,
    UNIQUE INDEX USERNAME_unique (USERNAME),
    PRIMARY KEY (ID)
);

CREATE TABLE TOPMENU(
    ID NUMBER NOT NULL AUTO_INCREMENT,
    TITLE VARCHAR NOT NULL,
    UNIQUE INDEX TITLE_unique (TITLE),
    PRIMARY KEY (ID)
);

CREATE TABLE SIDEMENU (
    ID NUMBER NOT NULL AUTO_INCREMENT,
    ACCESS VARCHAR NOT NULL,
    SIDE VARCHAR NOT NULL,
    TITLE VARCHAR NOT NULL,
    TEXT VARCHAR NOT NULL,
    PRIMARY KEY (ID)
);

CREATE TABLE HOME (
    ID NUMBER NOT NULL AUTO_INCREMENT,
    TITLE VARCHAR NOT NULL,
    TEXT VARCHAR NOT NULL,
    PRIMARY KEY (ID)
);

INSERT INTO TOPMENU (TITLE) VALUES ('Forside');
INSERT INTO TOPMENU (TITLE) VALUES ('Forum');
INSERT INTO TOPMENU (TITLE) VALUES ('Roster');
INSERT INTO TOPMENU (TITLE) VALUES ('Media');
INSERT INTO TOPMENU (TITLE) VALUES ('Aktivitet');

INSERT INTO HOME (TITLE, TEXT) VALUES ('Forside', '*** NYT NYT NYT*** Da vi nu ved at WoD er på vej har vi nu som noget helt nyt åbnet vores ellers lukket hold op, og vi søger 10-15 mand for at kunne opgradere til 25 mands (20mands i WoD) så føler du at du kan leve op til vores krav, og har lyst til at raide på top plan 3 dage om ugen, også endda raide på dansk ? Hvis du mener det gerne vil prøves af bedes du lave en bruger på hjemmesiden, og apply til guilden, ansøgnings skemaet bedes du udfylde, og udfyld det grundigt. Ønske du stadig bare at komme ind som social, gælder de samme regler som før Wink lav en profil på hjemmesiden (application spørgsmål behøver du ikke svare grundigt) og whisper in officer for inv in-game, dog husk at fortæl du vil ind som social Smile Hvis du allerede er i Guilden, men ikke er på hjemmesiden endnu, bedes du lave en apply til guilden, og brug dit ingame char navn som user-name, og du vil blive godkendt med det samme, eller når en officer lige er på.... Er du ikke medlem af guilden, men bare gerne vil være social er det selvf samme dur der gælder, lav en profil her, og whisper en officer in-game for inv til guilden.... GoodFellas out');

COMMIT;