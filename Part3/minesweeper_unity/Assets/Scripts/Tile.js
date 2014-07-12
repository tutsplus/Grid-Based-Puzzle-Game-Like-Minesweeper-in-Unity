#pragma strict

public var isMined:	boolean = false;

public var displayText: TextMesh;
public var displayFlag: GameObject;

public var materialIdle: Material;
public var materialLightup: Material;
public var materialUncovered: Material;
public var materialDetonated: Material;

public var ID: int;
public var tilesPerRow: int;

public var adjacentMines: int = 0;

public var state: String = "idle";

public var tileUpper: Tile;
public var tileLower: Tile;
public var tileLeft: Tile;
public var tileRight: Tile;

public var tileUpperRight: Tile;
public var tileUpperLeft: Tile;
public var tileLowerRight: Tile;
public var tileLowerLeft: Tile;

public var adjacentTiles: Array = new Array();

function Start()
{	
	displayFlag.renderer.enabled = false;
	displayText.renderer.enabled = false;

	if(inBounds(Grid.tilesAll, ID + tilesPerRow))                     tileUpper = Grid.tilesAll[ID + tilesPerRow];
	if(inBounds(Grid.tilesAll, ID - tilesPerRow))                     tileLower = Grid.tilesAll[ID - tilesPerRow];
	if(inBounds(Grid.tilesAll, ID - 1) &&     ID % tilesPerRow != 0)  tileLeft  = Grid.tilesAll[ID - 1];
	if(inBounds(Grid.tilesAll, ID + 1) && (ID+1) % tilesPerRow != 0)  tileRight = Grid.tilesAll[ID + 1];
	
	if(inBounds(Grid.tilesAll, ID + tilesPerRow + 1) && (ID+1) % tilesPerRow != 0) tileUpperRight = Grid.tilesAll[ID + tilesPerRow + 1];
	if(inBounds(Grid.tilesAll, ID + tilesPerRow - 1) &&     ID % tilesPerRow != 0) tileUpperLeft  = Grid.tilesAll[ID + tilesPerRow - 1];
	if(inBounds(Grid.tilesAll, ID - tilesPerRow + 1) && (ID+1) % tilesPerRow != 0) tileLowerRight = Grid.tilesAll[ID - tilesPerRow + 1];
	if(inBounds(Grid.tilesAll, ID - tilesPerRow - 1) &&     ID % tilesPerRow != 0) tileLowerLeft  = Grid.tilesAll[ID - tilesPerRow - 1];
	
	if(tileUpper)      adjacentTiles.Push(tileUpper);
	if(tileLower)      adjacentTiles.Push(tileLower);
	if(tileLeft)       adjacentTiles.Push(tileLeft);
	if(tileRight)      adjacentTiles.Push(tileRight);
	if(tileUpperRight) adjacentTiles.Push(tileUpperRight);
	if(tileUpperLeft)  adjacentTiles.Push(tileUpperLeft);
	if(tileLowerRight) adjacentTiles.Push(tileLowerRight);
	if(tileLowerLeft)  adjacentTiles.Push(tileLowerLeft);
	
	CountMines();
}

function OnMouseOver()
{
	if(Grid.state == "inGame")
	{
		if(state == "idle")
		{
			renderer.material = materialLightup;
		
			if (Input.GetMouseButtonDown(0))
				UncoverTile();

			if (Input.GetMouseButtonDown(1))
				SetFlag();
		}
		else if(state == "flagged")
		{
			renderer.material = materialLightup;
		
			if (Input.GetMouseButtonDown(1))
				SetFlag();
		}
	}
}

function OnMouseExit()
{
	if(Grid.state == "inGame")
	{
		if(state == "idle" || state == "flagged")
			renderer.material = materialIdle;
	}
}

function UncoverTile()
{
	if(!isMined)
	{
		state = "uncovered";
		displayText.renderer.enabled = true;
		renderer.material = materialUncovered;
		
		Grid.tilesUncovered += 1;
		
		if(adjacentMines == 0)
			UncoverAdjacentTiles();
	}
	else
		Explode();
}

function UncoverAdjacentTiles()
{
	for(var currentTile: Tile in adjacentTiles)
	{
		//uncover all adjacent nodes with 0 adjacent mines
		if(!currentTile.isMined && currentTile.state == "idle" && currentTile.adjacentMines == 0)
			currentTile.UncoverTile();
		
		//uncover all adjacent nodes with more than 1 adjacent mine, then stop uncovering
		else if(!currentTile.isMined && currentTile.state == "idle" && currentTile.adjacentMines > 0)
			currentTile.UncoverTileExternal();
	}
}

function UncoverTileExternal()
{
	state = "uncovered";
	displayText.renderer.enabled = true;
	renderer.material = materialUncovered;
	Grid.tilesUncovered += 1;
}

function Explode()
{
	state = "detonated";
	Grid.state = "gameOver";
	renderer.material = materialDetonated;
	
	for (var currentTile: Tile in Grid.tilesMined)
		currentTile.ExplodeExternal();
}

function ExplodeExternal()
{
	state = "detonated";
	renderer.material = materialDetonated;
}

function SetFlag()
{
	if(state == "idle")
	{
		state = "flagged";
		displayFlag.renderer.enabled = true;
		if(isMined)
			Grid.minesMarkedCorrectly += 1;

		Grid.minesRemaining -= 1;
	}
	else if(state == "flagged")
	{
		state = "idle";
		displayFlag.renderer.enabled = false;
		if(isMined)
			Grid.minesMarkedCorrectly -= 1;
			
		Grid.minesRemaining += 1;
	}
}

function CountMines()
{
	adjacentMines = 0;
	
	for each(var currentTile: Tile in adjacentTiles)
		if(currentTile.isMined)
			adjacentMines += 1;
	
	displayText.text = adjacentMines.ToString();
	
	if(adjacentMines <= 0)
		displayText.text = "";
}

function inBounds(inputArray: Array, targetID: int): boolean
{
	if(targetID < 0 || targetID >= inputArray.length)
		return false;
	else 
		return true;
}