# CM4025_CW
MMORPG CW


Game Description:
The game called Repair Center Simulator (RCS), 
where you assume the role of a repair technician 
that specialises in one of 4 roles (General Technician, 
Hardware Technician, Software Technician or Data Technician).
You will then form a store (team) or join an existing one
and along with your team members perfoem repairs to earn 
money and experiece for noth you and your store.

Working functionality:
  Create a technician character, with their own set of attributes.
  Create a team.
  Join a team.
  Perform repairs
    + Make money for team on successful repair.
    + Gain levels on successful repairs.
    + Multiple difficulty levels.
    + Scaling difficulty levels.
    + Modifiers based on class and repair type.
    + Random events.

Partialy working. 
(+) denotes the working parts, (-) denotes the non-working parts.
  - Gain levels/experience
    (+) Gain levels on sccessfuul repair
    (-) Didn't get Exp working, so awarded 1 level for every successful repair.
    (-) Didn't implement a way to increase stats, so starting stats remain throughout whole game.
  
  - Scaling repair difficulty
    (+) Amount of time to complete repairs decreases.
    (+) Amount of money awarded increases.
    (-) As players stats don't increase I wasn't able to increase the difficulty using 
      player stats, opting instead for basing it on time.
      
  - Chat
    (+) Players can chat to each other.
    (-) Players cannot chat to only members of their team as was originally planned.
      
Non-working functionality:
  - Not able to use money to buy upgrades for store (e.g upgraded tools and or increase store size).
  - As such I did not impose a limit on the amount of players that could join a team (original plan
    was to limit amount of players that could join a team based on the store size).
  - I was not able to add player IDs to the array of players in a team, therefor the amount of
    players shown in the team details is always 1 (the creator). Worked around this for the rest of the 
    game by saving TeamID in the player data, so all other functions such as joining teams and awarding money
    to your team still works.
  
   

