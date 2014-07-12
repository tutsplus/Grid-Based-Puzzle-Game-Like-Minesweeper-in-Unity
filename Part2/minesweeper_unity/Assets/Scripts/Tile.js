#pragma strict

public var isMined:	boolean = false;

public var displayText: TextMesh;
public var displayFlag: GameObject;

public var materialIdle: Material;
public var materialLightup: Material;

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
	renderer.material = materialLightup;
	
	if(state == "idle" || state == "flagged")
	{
		if (Input.GetMouseButtonDown(1))
			SetFlag();
	}
}

function SetFlag()
{
	if(state == "idle")
	{
		state = "flagged";
		displayFlag.renderer.enabled = true;
	}
	else if(state == "flagged")
	{
		state = "idle";
		displayFlag.renderer.enabled = false;
	}
}

function OnMouseExit()
{
	renderer.material = materialIdle;
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

private function inBounds(inputArray: Array, targetID: int): boolean
{
	if(targetID < 0 || targetID >= inputArray.length)
		return false;
	else 
		return true;
}