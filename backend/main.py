from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
import graphviz
import os
from fastapi.middleware.cors import CORSMiddleware
import utils

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
    theme: str
    nodes: list[Node]
    edges: list[Edge]

@app.get("/")
def root():
    return {"message": "Backend is running"}

@app.post("/generate")
def generate(data: MindmapData):
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)

    dot = graphviz.Digraph(comment=data.title, engine=data.layout or "dot")
    dot.attr(
        label=data.title,
        overlap="false",
        fontname=utils.font_name(data.theme),
        nodesep="1",
        ranksep="1.5",
        bgcolor=utils.color_5(data.theme),
        fontcolor=utils.color_1(data.theme)
    )

    styles = utils.theme_style(data.theme)

    for node in data.nodes:
        style = styles.get(
            node.type,
            {"shape": "box", "color": "gray", "fontname": utils.font_name(data.theme)}
        )
        dot.node(node.id, node.label, **style)

    for edge in data.edges:
        edge_style = utils.edge_style(data.theme)
        edge_style["style"] = "dashed" if edge.dashed else "solid"
        edge_style["label"] = utils.html_label(edge.label, data.theme) if edge.label else ""
        dot.edge(edge.from_node, edge.to_node, **edge_style)

    dot.render(filename="map", directory=output_dir, format="dot", cleanup=False)
    dot.render(filename="map", directory=output_dir, format="svg", cleanup=False)

    return {"message": "Mindmap generated successfully!"}


@app.get("/map")
def get_map():
    file_path = "output/map.svg"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="image/svg+xml")
    return {"error": "File not found"}

@app.get("/download")
def download():
    src = graphviz.Source.from_file("output/map.dot")
    src.render("output/map", format="pdf", cleanup=False)
    file_path = "output/map.pdf"
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/pdf")
    return {"error": "File not found"}
