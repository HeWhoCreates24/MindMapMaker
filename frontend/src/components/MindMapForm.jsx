import { useEffect, useState } from "react";

export default function MindMapForm() {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const bootBackend = async () => {
    const res = await fetch(backendUrl);
  }

  useEffect(() => {
    bootBackend()
  }, [])

  const [title, setTitle] = useState("");
  const [layout, setLayout] = useState("dot");
  const [theme, setTheme] = useState("classicLight");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [svgUrl, setSvgUrl] = useState("");

  const addNode = async (evt) => {
    await setNodes([...nodes, { id: "", label: "", type: "text" }])
    evt.target.previousElementSibling.firstChild.focus()
  };
  const addEdge = async (evt) => {
    await setEdges([...edges, { from_node: "", to_node: "", label: "", dashed: false, id: crypto.randomUUID() }])
    evt.target.previousElementSibling.firstChild.focus()
  };

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

  const handleKeyPress = (evt) => {
    if(evt.key == "Enter"){
      if(evt.target.id == "title" || evt.target.id == "layout"){
        console.log(evt)
        evt.target.parentElement.nextElementSibling.lastChild.focus()
      }
      else if(evt.target.id === "theme"){
        evt.target.blur()
      }
      else if(evt.target.classList.contains("last-input")){
        evt.target.parentElement.nextElementSibling.focus()
      }else{
        evt.target.nextElementSibling.focus()
      }
    }
  }

  const generateMap = async () => {
    await fetch(`${backendUrl}generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, layout, theme, nodes, edges })
    });
    setSvgUrl(`${backendUrl}map?${Date.now()}`); // prevent caching
  };

  useEffect(() => {
    generateMap()
  }, [title, layout, theme, nodes, edges])

  return (
    <div id="main-container">
      <h1>MindMap Maker</h1>
      <div id="form-container">

          <h2>MindMap Data</h2>
        <div className="input-group-container">
          <div className="input-group">
            <h3>Map Title</h3>
            <input value={title} onKeyDown={handleKeyPress} onChange={e => setTitle(e.target.value)} id="title" placeholder="Map Title" />
          </div>

          <div className="input-group">
            <h3>Map Layout</h3>
            <select value={layout} onKeyDown={handleKeyPress} onChange={e => setLayout(e.target.value)} id="layout" >
              <option value="dot">Dot</option>
              <option value="neato">Neato</option>
              <option value="fdp">Fdp</option>
              <option value="sfdp">Sfdp</option>
              <option value="circo">Circo</option>
              <option value="twopi">Twopi</option>
              <option value="patchwork">Patch-Work</option>
              <option value="osage">Osage</option>
            </select>
          </div>

          <div className="input-group">
            <h3>Map Theme</h3>
            <select value={theme} onKeyDown={handleKeyPress} onChange={e => setTheme(e.target.value)} id="theme" >
              <option value="classicLight">Classic Light</option>
              <option value="classicDark">Classic Dark</option>
            </select>
          </div>
        </div>


        <div className="input-group-container">
          <div className="input-group">
            <h3>Nodes</h3>
            {nodes.map((node, i) => (
              <div className="input-container" key={i}>
                <input placeholder="ID" value={node.id} onKeyDown={handleKeyPress} onChange={e => handleNodeChange(i, "id", e.target.value)} />
                <input placeholder="Label" value={node.label} onKeyDown={handleKeyPress} onChange={e => handleNodeChange(i, "label", e.target.value)} />
                <select value={node.type} onKeyDown={handleKeyPress} onChange={e => handleNodeChange(i, "type", e.target.value)} className="last-input" >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                  <option value="text">Text</option>
                  <option value="formula">Formula</option>
                </select>
                <button className="del" onClick={e => setNodes(prev => prev.filter(n => n.id != node.id))} >delete</button>
              </div>
            ))}
            <button onClick={addNode}>Add Node</button>
          </div>
    
          <div className="input-group">
            <h3>Edges</h3>
            {edges.map((edge, i) => (
              <div className="input-container" key={i}>
                <input placeholder="From" value={edge.from_node} onKeyDown={handleKeyPress} onChange={e => handleEdgeChange(i, "from_node", e.target.value)} />
                <input placeholder="To" value={edge.to_node} onKeyDown={handleKeyPress} onChange={e => handleEdgeChange(i, "to_node", e.target.value)} />
                <input placeholder="Label" value={edge.label} onKeyDown={handleKeyPress} onChange={e => handleEdgeChange(i, "label", e.target.value)} className="last-input" />
                <label>
                  Dashed
                  <input type="checkbox" checked={edge.dashed} onChange={e => handleEdgeChange(i, "dashed", e.target.checked)} />
                </label>
                <button className="del" onClick={e => setEdges(prev => prev.filter(e => e.id != edge.id))} >delete</button>
              </div>
            ))}
            <button onClick={addEdge}>Add Edge</button>
          </div>
        </div>

      </div>

      <div id="preview-container" >
        <h2>MindMap Preview</h2>
        <img src={svgUrl} alt="MindMap" />
        <a href={`${backendUrl}download`}>Save as PDF</a>
      </div>
    </div>
  );
}
