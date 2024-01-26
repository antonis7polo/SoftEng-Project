/*
This script adds primiary and foreign key constraints to the IMDb database
tables. There are some issues with missing data, please see IMDb_data_issues.md
for a discussion of these.


*/

-- Add constraints individually
ALTER TABLE Names_
ADD CONSTRAINT Names_pri_key PRIMARY KEY (name_id);

ALTER TABLE Titles
ADD CONSTRAINT Titles_pri_key PRIMARY KEY (title_id);

ALTER TABLE Aliases
ADD CONSTRAINT Aliases_pri_key PRIMARY KEY (title_id,ordering);

ALTER TABLE Directors
ADD CONSTRAINT Directors_pri_key PRIMARY KEY (title_id,name_id);

ALTER TABLE Directors
ADD CONSTRAINT Directors_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);

ALTER TABLE Writers
ADD CONSTRAINT Writers_pri_key PRIMARY KEY (title_id,name_id);

ALTER TABLE Writers
ADD CONSTRAINT Writers_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);

ALTER TABLE Episode_belongs_to
ADD CONSTRAINT Episode_belongs_to_pri_key PRIMARY KEY (episode_title_id);

ALTER TABLE Episode_belongs_to
ADD CONSTRAINT Episode_belongs_to_ep_title_id_fkey FOREIGN KEY (episode_title_id) REFERENCES Titles(title_id);

ALTER TABLE Name_worked_as
ADD CONSTRAINT Name_worked_as_pri_key PRIMARY KEY (name_id,profession);

ALTER TABLE Name_worked_as
ADD CONSTRAINT Name_worked_as_name_id_fkey FOREIGN KEY (name_id) REFERENCES Names_(name_id);

ALTER TABLE Known_for
ADD CONSTRAINT Known_for_pri_key PRIMARY KEY (name_id,title_id);

ALTER TABLE Known_for
ADD CONSTRAINT Known_for_name_id_fkey FOREIGN KEY (name_id) REFERENCES Names_(name_id);

ALTER TABLE Principals
ADD CONSTRAINT Principals_pri_key PRIMARY KEY (title_id,ordering);

-- role_ is TEXT, so we need to add indexing length (255)
ALTER TABLE Had_role
ADD CONSTRAINT Had_role_pri_key PRIMARY KEY (title_id,name_id,role_(255));

ALTER TABLE Title_genres
ADD CONSTRAINT Title_genres_pri_key PRIMARY KEY (title_id,genre);

ALTER TABLE Title_genres
ADD CONSTRAINT Title_genres_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);

ALTER TABLE User_Title_Ratings
ADD CONSTRAINT User_Title_Ratings_pri_key PRIMARY KEY (user_id,title_id);

ALTER TABLE User_Title_Ratings
ADD CONSTRAINT User_Title_Ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES Users(user_id);

ALTER TABLE User_Title_Ratings
ADD CONSTRAINT User_Title_Ratings_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);


-- Issues with missing data in title.basics.tsv.gz, name.basics.tsv, ...

-- Disable foreign key check lock
SET foreign_key_checks = 0;

-- Aliases has titles that do not exist in Titles, i.e., there are entries in
-- IMDb's title.akas.tsv that are not present in title.basics.tsv. The same
-- issue arises when setting the foreign key for the Alias_attributes and
-- Alias_types tables.
ALTER TABLE Aliases
ADD CONSTRAINT Aliases_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);
-- SELECT * FROM Aliases AS A WHERE A.title_id NOT IN (SELECT title_id FROM Titles) LIMIT 10;
-- SELECT * FROM Titles WHERE title_id = 'tt0021006';
-- SELECT * FROM Aliases WHERE title_id = 'tt0021006';

-- Ditto for Episode_belongs_to table.
ALTER TABLE Episode_belongs_to
ADD CONSTRAINT Episode_belongs_to_show_title_id_fkey FOREIGN KEY (parent_tv_show_title_id) REFERENCES Titles(title_id);
-- SELECT DISTINCT E.parent_tv_show_title_id
-- FROM Episode_belongs_to AS E
-- WHERE E.parent_tv_show_title_id NOT IN (SELECT title_id FROM Titles)
-- LIMIT 10;
-- SELECT * FROM Titles WHERE title_id = 'tt6403604';
-- SELECT * FROM Episode_belongs_to WHERE parent_tv_show_title_id = 'tt6403604';

ALTER TABLE Known_for
ADD CONSTRAINT Known_for_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);
-- SELECT * FROM Known_for AS K WHERE K.title_id NOT IN (SELECT title_id FROM Titles) LIMIT 10;
-- SELECT * FROM Titles WHERE title_id = 'tt0331007';
-- SELECT * FROM Known_for WHERE title_id = 'tt0331007' LIMIT 5;

ALTER TABLE Principals
ADD CONSTRAINT Principals_name_id_fkey FOREIGN KEY (name_id) REFERENCES Names_(name_id);
-- SELECT * FROM Principals AS P WHERE P.name_id NOT IN (SELECT name_id FROM Names_) LIMIT 10;
-- SELECT * FROM Names_ WHERE name_id = 'nm0730493';
-- SELECT * FROM Principals WHERE name_id = 'nm0730493';

ALTER TABLE Principals
ADD CONSTRAINT Principals_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);
-- SELECT * FROM Principals AS P WHERE P.title_id NOT IN (SELECT title_id FROM Titles) LIMIT 10;
-- SELECT * FROM Titles WHERE title_id = 'tt0047941';
-- SELECT * FROM Principals WHERE title_id = 'tt0047941';

ALTER TABLE Had_role
ADD CONSTRAINT Had_role_title_id_fkey FOREIGN KEY (title_id) REFERENCES Titles(title_id);
-- SELECT * FROM Had_role AS H WHERE H.title_id NOT IN (SELECT title_id FROM Titles) LIMIT 10;
-- SELECT * FROM Titles WHERE title_id = 'tt0047941';
-- SELECT * FROM Had_role WHERE title_id = 'tt0047941';

ALTER TABLE Had_role
ADD CONSTRAINT Had_role_name_id_fkey FOREIGN KEY (name_id) REFERENCES Names_(name_id);
-- SELECT * FROM Had_role AS H WHERE H.name_id NOT IN (SELECT name_id FROM Names_) LIMIT 10;
-- SELECT * FROM Names_ WHERE name_id = 'nm0241605';
-- SELECT * FROM Had_role WHERE name_id = 'nm0241605';

ALTER TABLE Directors
ADD CONSTRAINT Directors_name_id_fkey FOREIGN KEY (name_id) REFERENCES Names_(name_id);
-- SELECT * FROM Directors AS D WHERE D.name_id NOT IN (SELECT name_id FROM Names_) LIMIT 10;
-- SELECT * FROM Names_ WHERE name_id = 'nm10576972';
-- SELECT * FROM Directors WHERE name_id = 'nm10576972';

ALTER TABLE Writers
ADD CONSTRAINT Writers_name_id_fkey FOREIGN KEY (name_id) REFERENCES Names_(name_id);
-- SELECT * FROM Writers AS W WHERE W.name_id NOT IN (SELECT name_id FROM Names_) LIMIT 10;
-- SELECT * FROM Names_ WHERE name_id = 'nm10032129';
-- SELECT * FROM Writers WHERE name_id = 'nm10032129';

-- Enable foreign key check lock
SET foreign_key_checks = 1;


