-- Add at least one index per table

-- Alias_attributes
CREATE INDEX Alias_attributes_index ON Alias_attributes(title_id);

-- Alias_types
CREATE INDEX Alias_types_index ON Alias_types(title_id);

-- Aliases
CREATE INDEX Aliases_index ON Aliases(title_id);

-- Directors
CREATE INDEX Directors_title_id_index ON Directors(title_id);
CREATE INDEX Directors_name_id_index ON Directors(name_id);

-- Episode_belongs_to
CREATE INDEX Episode_belongs_to_ep_title_id_index ON Episode_belongs_to(episode_title_id);
CREATE INDEX Episode_belongs_to_show_title_id_index ON Episode_belongs_to(parent_tv_show_title_id);

-- Had_role
CREATE INDEX Had_role_title_id_index ON Had_role(title_id);
CREATE INDEX Had_role_name_id_index ON Had_role(name_id);

-- Known_for
CREATE INDEX Known_for_index ON Known_for(name_id);

-- Name_worked_as
CREATE INDEX Name_worked_as_index ON Name_worked_as(profession);

-- Names_
CREATE INDEX Names_index ON Names_(name_id);

-- Principals
CREATE INDEX Principals_index ON Principals(title_id);

-- Title_genres
CREATE INDEX Title_genres_title_id_index ON Title_genres(title_id);
CREATE INDEX Title_genres_genre_index ON Title_genres(genre);

-- Title_ratings
CREATE INDEX Title_ratings_index ON Title_ratings(title_id);

-- Titles
CREATE INDEX Titles_index ON Titles(title_id);

-- Writers
CREATE INDEX Writers_title_id_index ON Writers(title_id);
CREATE INDEX Writers_name_id_index ON Writers(name_id);