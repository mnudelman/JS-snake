-- UPDATE taskdoings SET doingname = 'create' WHERE doingname = 'creat' ;
-- DELETE FROM taskdoings ;
--CREATE DATABASE IF NOT EXISTS games ;
-- DROP TABLE gameattr ;
-- -- gameattr - атрибуты игры
-- CREATE TABLE IF NOT EXISTS gameattr (
-- id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
-- rid    INTEGER REFERENCES results (rid),
-- attrid INTEGER
--         REFERENCES attributs (attrid) ON DELETE CASCADE,
-- attrvalue INTEGER
-- ) ;
-- SELECT * FROM gameattr ;
--update results set timeid = timeid + floor(rand()*100) ;

-- update attributes set attrname = 'gameTime' where attrid = 4 ;
-- select * from attributes ;
--alter TABLE results ADD UNIQUE  (timeid)  ;
SELECT attributes.attrid,
       attributes.attrname,
       tabTest.attrvalue
       FROM attributes
       LEFT JOIN
        ( SELECT * FROM gameattr WHERE  gameattr.rid = 10
          ) AS tabTest
        ON   tabTest.attrid = attributes.attrid ;
                                  ;

