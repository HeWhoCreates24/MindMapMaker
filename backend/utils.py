def html_label(label, theme):
    return f'''<
                <TABLE BORDER="0" CELLBORDER="1" CELLSPACING="0" BGCOLOR="lightgray">
                    <TR><TD>{label}</TD></TR>
                </TABLE>
            >'''

def font_name(theme):
    return "Verdana"

def theme_style(theme):
    if(theme == "classicLight"):
        return {
            "h1": {"shape": "box", "style": "filled,rounded", "fillcolor": "lightcoral", "penwidth": "1", "color": "black", "fontsize": "20", "fontname":font_name(theme)},
            "h2": {"shape": "box", "style": "filled,rounded", "fillcolor": "lightpink", "penwidth": "1", "color": "black", "fontsize": "16", "fontname":font_name(theme)},
            "h3": {"shape": "box", "style": "filled,rounded", "fillcolor": "lightblue", "penwidth": "1", "color": "black", "fontsize": "14", "fontname":font_name(theme)},
            "text": {"shape": "box", "penwidth": "1", "color": "black", "fontsize": "12", "fontname":font_name(theme)},
            "formula": {"shape": "box", "style": "filled", "fillcolor": "black", "fontcolor": "white", "fontsize": "14", "fontname":font_name(theme)}
        }
    elif(theme == "classicDark"):
        return {
            "h1": {"shape": "box", "style": "filled,rounded", "fillcolor": "#D16328", "penwidth": "1", "color": "white", "fontcolor": "white", "fontsize": "20", "fontname":font_name(theme)},
            "h2": {"shape": "box", "style": "filled,rounded", "fillcolor": "#B56576", "penwidth": "1", "color": "white", "fontcolor": "white", "fontsize": "16", "fontname":font_name(theme)},
            "h3": {"shape": "box", "style": "filled,rounded", "fillcolor": "#6D597A", "penwidth": "1", "color": "white", "fontcolor": "white", "fontsize": "14", "fontname":font_name(theme)},
            "text": {"shape": "box", "style": "filled", "fillcolor": "#3B587D", "penwidth": "1", "color": "white", "fontcolor": "white", "fontsize": "12", "fontname":font_name(theme)},
            "formula": {"shape": "box", "style": "filled", "fillcolor": "black", "fontcolor": "white", "fontsize": "14", "fontname":font_name(theme)}
        }
    

def color_1(theme):
    if(theme == "classicLight"):
        return "black"
    elif(theme == "classicDark"):
        return "white"

def color_5(theme):
    if(theme == "classicLight"):
        return "white"
    elif(theme == "classicDark"):
        return "#1A2737"
    
def edge_style(theme):
    if(theme == "classicLight"):
        return {
            "color": color_1(theme)
        }
    elif(theme == "classicDark"):
        return {
            "color": color_1(theme)
        }