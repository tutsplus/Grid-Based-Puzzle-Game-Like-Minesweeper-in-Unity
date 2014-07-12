#pragma strict

public var tilePrefab: 				Tile;
public var numberOfTiles: 			int = 10;
public var tilesPerRow: 			int = 4;
public var distanceBetweenTiles: 	float = 1.0;
public var numberOfMines:			int = 10;

static var tilesAll: Tile[];
static var tilesMined: Array;
static var tilesUnmined: Array;

static var state: String = "inGame";

static var minesMarkedCorrectly: int = 0;
static var tilesUncovered: int = 0;
static var minesRemaining: int = 0;

function Start()
{
	CreateTiles();
	
	minesRemaining = numberOfMines;
	minesMarkedCorrectly = 0;
	tilesUncovered = 0;
	
	state = "inGame";
}

function Update()
{
	if(state == "inGame")
	{
		if((minesRemaining == 0 && minesMarkedCorrectly == numberOfMines) || (tilesUncovered == numberOfTiles - numberOfMines))
			FinishGame();
	}
}

function OnGUI()
{
	if(state == "inGame")
	{
		GUI.Box(Rect(10,10,200,50), "Mines left: " + minesRemaining);
	}
	else if(state == "gameOver")
	{
		GUI.Box(Rect(10,10,200,50), "You lose");
		
		if(GUI.Button(Rect(10,70,200,50), "Restart"))
			Restart();
	}
	else if(state == "gameWon")
	{
		GUI.Box(Rect(10,10,200,50), "You rock!");
		
		if(GUI.Button(Rect(10,70,200,50), "Restart"))
			Restart();
	}
}

function Restart()
{
	state = "loading";
	Application.LoadLevel(Application.loadedLevel);
}

function FinishGame()
{
	state = "gameWon";
	
	//uncovers remaining fields if all nodes have been placed
	for(var currentTile: Tile in tilesAll) 	
		if(currentTile.state == "idle" && !currentTile.isMined)
			currentTile.UncoverTileExternal();
	
	//marks remaining mines if all nodes except the mines have been uncovered
	for(var currentTile: Tile in Grid.tilesMined)	
		if(currentTile.state != "flagged")
			currentTile.SetFlag();
}

function CreateTiles()
{
	tilesAll = new Tile[numberOfTiles];
	tilesMined = new Array();
	tilesUnmined = new Array();

	var xOffset: float = 0.0;
	var zOffset: float = 0.0;

	for(var tilesCreated: int = 0; tilesCreated < numberOfTiles; tilesCreated += 1)
	{
		xOffset += distanceBetweenTiles;
		
		if(tilesCreated % tilesPerRow == 0)
		{
			zOffset += distanceBetweenTiles;
			xOffset = 0;
		}
	
		var newTile = Instantiate(tilePrefab, Vector3(transform.position.x + xOffset, transform.position.y, transform.position.z + zOffset), transform.rotation);
		tilesAll[tilesCreated] = newTile;
		
		newTile.ID = tilesCreated;
		newTile.tilesPerRow = tilesPerRow;
	}
	
	AssignMines();
}

function AssignMines()
{
	tilesUnmined = tilesAll;
	
	for(var minesAssigned: int = 0; minesAssigned < numberOfMines; minesAssigned += 1)
	{
		var currentTile: Tile = tilesUnmined[Random.Range(0, tilesUnmined.length)];

		tilesMined.Push(currentTile);
		tilesUnmined.Remove(currentTile);
		
		currentTile.isMined = true;
	}
}