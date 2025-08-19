from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
import graphviz
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Node(BaseModel):
    id: str
    label: str
    type: str

class Edge(BaseModel):
    from_node: str
    to_node: str
    label: str | None = None
    dashed: bool = False

class MindmapData(BaseModel):
    title: str
    layout: str
    nodes: list[Node]
    edges: list[Edge]

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}

@app.post("/generate")
def generate(data: MindmapData):
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "map")

    dot = graphviz.Digraph(comment=data.title, format="svg", engine=data.layout or "dot")
    dot.attr(label=data.title, overlap="false", fontname="Verdana")

    styles = {
        "h1": {"shape": "box", "style": "filled,rounded", "fillcolor": "lightcoral", "penwidth": "1", "color": "black", "fontsize": "20", "fontname":"Verdana"},
        "h2": {"shape": "box", "style": "filled,rounded", "fillcolor": "lightpink", "penwidth": "1", "color": "black", "fontsize": "16", "fontname":"Verdana"},
        "h3": {"shape": "box", "style": "filled,rounded", "fillcolor": "lightblue", "penwidth": "1", "color": "black", "fontsize": "14", "fontname":"Verdana"},
        "text": {"shape": "box", "penwidth": "1", "color": "black", "fontsize": "12", "fontname":"Verdana"},
        "formula": {"shape": "box", "style": "filled", "fillcolor": "black", "fontcolor": "white", "fontsize": "14", "fontname":"Verdana"}
    }

    for node in data.nodes:
        style = styles.get(node.type, {"shape": "box", "color": "gray", "fontname":"Verdana"})
        dot.node(node.id, node.label, **style)

    for edge in data.edges:
        edge_style = {"style": "dashed"} if edge.dashed else {}
        if(edge.label):
            html_label = f'''<
                <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="lightgray">
                    <TR><TD>{edge.label or ""}</TD></TR>
                </TABLE>
            >'''
        dot.edge(edge.from_node, edge.to_node, label=html_label if edge.label else "", **edge_style)

    dot.render(output_path, cleanup=True)
    return {"message": "Mindmap generated successfully!"}

@app.get("/map")
def get_map():
    file_path = "output/map.svg"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/svg+xml")
    return {"error": "File not found"}
