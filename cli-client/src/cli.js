#!/usr/bin/env node

const { Command } = require('commander'); 
const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const addUserCommand = require('./commands/adduser');
const getUserCommand = require('./commands/users');
const healthCheckCommand = require('./commands/healthcheck');
const resetAllCommand = require('./commands/resetall');
const newTitlesCommand = require('./commands/newtitles');
const newAkasCommand = require('./commands/newakas');
const newNamesCommand = require('./commands/newnames');
const newCrewCommand = require('./commands/newcrew');
const newEpisodeCommand = require('./commands/newepisode');
const newPrincipalsCommand = require('./commands/newprincipals');
const newRatingsCommand = require('./commands/newratings');
const TitleCommand = require('./commands/title');
const SearchTitleCommand = require('./commands/searchtitle');
const byGenreCommand = require('./commands/bygenre');
const nameCommand = require('./commands/name');
const searchNameCommand = require('./commands/searchname');
const uploadRatingCommand = require('./commands/uploadrating');
const userRatingsCommand = require('./commands/userratings');
const deleteRatingCommand = require('./commands/deleterating');
const recommendationsCommand = require('./commands/getmovierecommendations');
const titleDetailsCommand = require('./commands/titledetails');
const homeCommand = require('./commands/home');
const tvShowsEpisodesCommand = require('./commands/tvshowsepisodes');

const program = new Command();

program
  .name('se2321')
  .description('CLI client of REST API')
  .version('1.0.0')


loginCommand(program);
logoutCommand(program);
addUserCommand(program);
getUserCommand(program);
healthCheckCommand(program);
resetAllCommand(program);
newTitlesCommand(program);
newAkasCommand(program);
newNamesCommand(program);
newCrewCommand(program);
newEpisodeCommand(program);
newPrincipalsCommand(program);
newRatingsCommand(program);
TitleCommand(program);
SearchTitleCommand(program);
byGenreCommand(program);
nameCommand(program);
searchNameCommand(program);
uploadRatingCommand(program);
userRatingsCommand(program);
deleteRatingCommand(program);
recommendationsCommand(program);
titleDetailsCommand(program);
homeCommand(program);
tvShowsEpisodesCommand(program);


program.parse(process.argv);

