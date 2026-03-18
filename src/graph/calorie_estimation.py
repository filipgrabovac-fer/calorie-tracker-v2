import base64
import os
from typing import Any, TypedDict

from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel


class CalorieEstimateOutput(BaseModel):
    estimated_calories: int


class CalorieEstimationState(TypedDict):
    title: str | None
    description: str | None
    ingredients: list[dict[str, Any]]
    image_base64: str | None
    estimated_calories: int | None


def _build_text_prompt(title: str | None, description: str | None, ingredients: list[dict[str, Any]]) -> str:
    parts = []
    if title:
        parts.append(f"Meal: {title}")
    if description:
        parts.append(f"Notes: {description}")
    if ingredients:
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
    return "\n".join(parts)


def _estimate_node(state: CalorieEstimationState) -> dict[str, Any]:
    text_prompt = _build_text_prompt(state["title"], state["description"], state["ingredients"])
    image_base64 = state.get("image_base64")

    has_text = bool(text_prompt.strip())
    has_image = bool(image_base64)

    if not has_text and not has_image:
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
        "You are a nutrition expert. "
        "Estimate the total approximate calories for the meal described below. "
        "If an image is provided, use it to identify the meal and portion size. "
        "If ingredients with weights are listed, prioritize those for accuracy. "
        "Respond with a single integer: estimated_calories."
    )

    if has_text:
        user_text = f"{system}\n\n{text_prompt}\n\nProvide the estimated total calories as an integer."
    else:
        user_text = f"{system}\n\nEstimate the calories from the image provided. Provide the estimated total calories as an integer."

    content: list[Any] = []
    if has_image:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
        })
    content.append({"type": "text", "text": user_text})

    result = structured_llm.invoke([HumanMessage(content=content)])
    return {"estimated_calories": result.estimated_calories}


def build_calorie_estimation_graph() -> StateGraph:
    graph = StateGraph(CalorieEstimationState)
    graph.add_node("estimate", _estimate_node)
    graph.add_edge(START, "estimate")
    graph.add_edge("estimate", END)
    return graph.compile()


def estimate_calories(
    title: str | None,
    ingredients: list[dict[str, Any]],
    description: str | None = None,
    image_base64: str | None = None,
) -> int:
    compiled = build_calorie_estimation_graph()
    result = compiled.invoke({
        "title": title,
        "description": description,
        "ingredients": ingredients,
        "image_base64": image_base64,
        "estimated_calories": None,
    })
    estimated = result.get("estimated_calories")
    if estimated is None:
        raise ValueError("Could not estimate calories from the given inputs")
    return estimated
