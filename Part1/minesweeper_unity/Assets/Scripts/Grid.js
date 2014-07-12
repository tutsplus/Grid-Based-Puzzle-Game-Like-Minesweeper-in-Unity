#pragma strict

public var tilePrefab: Tile;
public var numberOfTiles: int = 10;
public var tilesPerRow: int = 4;
public var distanceBetweenTiles: float = 1.0;
public var numberOfMines: int = 10;

static var tilesAll: Tile[];
static var tilesMined: Array;
static var tilesUnmined: Array;

function Start()
{
	CreateTiles();
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
		
		currentTile.GetComponent(Tile).isMined = true;
	}
}