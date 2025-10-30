# OpenAI gpt-4o-mini API

It's a REST endpoint that takes a chat transcript and returns a crisp summary (and optional action items) using an LLM. It's lightweight, well-structured, and production-friendly.

## Installation

Clone the project and run the command below inside the project root directory from the command prompt or terminal.

```bash
npm install
npm start
```

## Usage

```python
# endpoint POST http://localhost:3000/api/summary

# Input params in API body
{
  "transcript": [
    { "role": "user", "message": "Hey team, let's plan the next sprint." },
    { "role": "assistant", "message": "Sure, let's do it on Monday." },
    { "role": "user", "message": "Also, fix the login bug before then." }
  ],
  "include_action_items": true
}


# Output will be something like this
{
  "summary": "The team discussed scheduling the next sprint for Monday and agreed to fix the login bug beforehand.\n\n**Action Items:**\n- Schedule sprint for Monday\n- Fix login bug before the sprint"
}

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)