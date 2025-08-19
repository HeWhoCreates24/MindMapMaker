import { useState } from "react";

export default function MindMapForm() {
  const [title, setTitle] = useState("");
  const [layout, setLayout] = useState("dot");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [svgUrl, setSvgUrl] = useState("");

  const addNode = () => setNodes([...nodes, { id: "", label: "", type: "text" }]);
  const addEdge = () => setEdges([...edges, { from_node: "", to_node: "", label: "", dashed: false }]);

  const handleNodeChange = (i, field, value) => {
    const newNodes = [...nodes];
    newNodes[i][field] = value;
    setNodes(newNodes);
  };

  const handleEdgeChange = (i, field, value) => {
    const newEdges = [...edges];
    newEdges[i][field] = value;
    setEdges(newEdges);
  };

  const isValidMap = () => {
    if(!title || !nodes.length) return false
    else return true
  }

  const generateMap = async () => {
    if(isValidMap()){
      await fetch("https://mindmapmaker-c0zq.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, layout, nodes, edges })
      });
      setSvgUrl(`https://mindmapmaker-c0zq.onrender.com/map?${Date.now()}`); // prevent caching
    }else{
      alert("Please input a valid Map")
    }
  };

  return (
    <div id="form-container">
      <h1>MindMap Maker</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Map Title" />

      <h2>Nodes</h2>
      {nodes.map((node, i) => (
        <div className="input-container" key={i}>
          <input placeholder="ID" value={node.id} onChange={e => handleNodeChange(i, "id", e.target.value)} />
          <input placeholder="Label" value={node.label} onChange={e => handleNodeChange(i, "label", e.target.value)} />
          <select value={node.type} onChange={e => handleNodeChange(i, "type", e.target.value)}>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="text">Text</option>
            <option value="formula">Formula</option>
          </select>
        </div>
      ))}
      <button onClick={addNode}>Add Node</button>

      <h2>Edges</h2>
      {edges.map((edge, i) => (
        <div className="input-container" key={i}>
          <input placeholder="From" value={edge.from_node} onChange={e => handleEdgeChange(i, "from_node", e.target.value)} />
          <input placeholder="To" value={edge.to_node} onChange={e => handleEdgeChange(i, "to_node", e.target.value)} />
          <input placeholder="Label" value={edge.label} onChange={e => handleEdgeChange(i, "label", e.target.value)} />
          <label>
            Dashed
            <input type="checkbox" checked={edge.dashed} onChange={e => handleEdgeChange(i, "dashed", e.target.checked)} />
          </label>
        </div>
      ))}
      <button onClick={addEdge}>Add Edge</button>

      <h2>Map Layout</h2>
      <select value={layout} onChange={e => setLayout(e.target.value)}>
        <option value="dot">Dot</option>
        <option value="neato">Neato</option>
        <option value="fdp">Fdp</option>
        <option value="sfdp">Sfdp</option>
        <option value="circo">Circo</option>
        <option value="twopi">Twopi</option>
        <option value="patchwork">Patch-Work</option>
        <option value="osage">Osage</option>
      </select>

      <div>
        <button onClick={generateMap}>Generate Map</button>
      </div>

      {svgUrl && (
        <div>
          <h2>MindMap Preview</h2>
          <br />
          <img src={svgUrl} alt="MindMap" />
        </div>
      )}
    </div>
  );
}
