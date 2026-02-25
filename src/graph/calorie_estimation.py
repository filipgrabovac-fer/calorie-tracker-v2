import os
from typing import Any, TypedDict

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel


class CalorieEstimateOutput(BaseModel):
    estimated_calories: int


class CalorieEstimationState(TypedDict):
    title: str | None
    ingredients: list[dict[str, Any]]
    estimated_calories: int | None


def _build_prompt(title: str | None, ingredients: list[dict[str, Any]]) -> str:
    parts = []
    if title:
        parts.append(f"Meal: {title}")
    parts.append("Ingredients:")
    for ing in ingredients:
        name = ing.get("name", "").strip()
        if not name:
            continue
        weight = ing.get("weight_grams")
        if weight is not None:
            parts.append(f"  - {name}: {weight} g")
        else:
            parts.append(f"  - {name}")
    return "\n".join(parts) if parts else ""


def _estimate_node(state: CalorieEstimationState) -> dict[str, Any]:
    prompt = _build_prompt(state["title"], state["ingredients"])
    if not prompt.strip():
        return {"estimated_calories": None}

    model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY is required for calorie estimation")

    llm = ChatGoogleGenerativeAI(
        model=model_name,
        api_key=api_key,
        temperature=0.2,
    )
    structured_llm = llm.with_structured_output(CalorieEstimateOutput)

    system = (
        "You are a nutrition expert. Given a list of ingredients (with optional weights in grams), "
        "estimate the total approximate calories for the whole meal. "
        "Respond with a single integer: estimated_calories. "
        "Use typical calorie densities when weight is not provided."
    )
    full_prompt = f"{system}\n\n{prompt}\n\nProvide the estimated total calories as an integer."

    result = structured_llm.invoke(full_prompt)
    return {"estimated_calories": result.estimated_calories}


def build_calorie_estimation_graph() -> StateGraph:
    graph = StateGraph(CalorieEstimationState)
    graph.add_node("estimate", _estimate_node)
    graph.add_edge(START, "estimate")
    graph.add_edge("estimate", END)
    return graph.compile()


def estimate_calories(title: str | None, ingredients: list[dict[str, Any]]) -> int:
    compiled = build_calorie_estimation_graph()
    result = compiled.invoke({"title": title, "ingredients": ingredients, "estimated_calories": None})
    estimated = result.get("estimated_calories")
    if estimated is None:
        raise ValueError("Could not estimate calories from the given ingredients")
    return estimated
