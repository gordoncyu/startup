# CS260 Startup - Dots and Boxes Across the World
Have you ever had the problem where you've felt the urge to play dots and boxes with your friend, but they happen to not be in the same physical location as you?  
What? What do you mean you haven't? You don't know what dots and boxes is? Well don't I have the product for you!

## Dots and Boxes
(as traditionally played on paper, images not representative of my product; not my mock)  
Dots and boxes is a multiplayer game that takes place on a m x n grid of dots:  
![game_start](./readme_images/v4-728px-Play-Dots-and-Boxes-Step-3.jpg)  
Images courtesy of [wikihow](https://www.wikihow.com/Play-Dots-and-Boxes)  

Each player takes a turn drawing a horizontal or vertical line between two adjacent dots:  
![no_completions](./readme_images/v4-728px-Play-Dots-and-Boxes-Step-5.jpg.jpeg)  

Players attempt to draw the last line to complete a box, and when they do, they claim that box and gain a point:  
![one_completion](./readme_images/v4-728px-Play-Dots-and-Boxes-Step-6.jpg.jpeg)  

When this happens, the player goes again.  
This goes on till all boxes have been completed. The points are tallied up, and the player with the most points wins.  

## The Usual Problem  
As you can probably tell, the game is usually played with pen and paper. This becomes a problem when you're not in the same physical location as you desired opponent(s) as a given paper can only be in one place at once.

## The Solution--My Product of Course (give me your money)
My startup solves this urgent problem caused by the limitations of paper by using web technologies to host a multiplayer game of dots and boxes.  

It does so unconstrained, allowing for game parameters unseen in its physical predecessor, such as stupidly large grid dimensions and large amounts of players.  
![normal_play](./readme_images/normal_play_grid.png)  
A rough sketch of a normal size play grid of my final product  


![rather_large_grid](./readme_images/rather_large_play_grid.png)
A rather large play grid  


![stupidly_large_grid](./readme_images/stupidly_large_play_grid.png)  
A grid that would be infeasable on any other medium than digital  


![too_many_players](./readme_images/too_many_colors.png)  
A game with too many players to fit in one room or usual physical space  

As you can see, the default dots and boxes medium should have been the web ages ago. It enables so much more freedom than the traditional medium.  

The centralized medium also allows for accurate scoreboard keeping, making a global leaderboard feasible.  
![leaderboard](./readme_images/leaderboard.png)  

## CS260 Technology Requirements:  
My product will use websockets for facilitating making moves and receiving moves made by the other player.  
It will also use authentication and a database for keeping track of the global leaderboard.
