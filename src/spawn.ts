const spawn = () => {
    for (const sname in Game.spawns) {
        let spawn = Game.spawns[sname];
        let room = spawn.room;
        let creeps = room.find(FIND_MY_CREEPS);
    }
};
