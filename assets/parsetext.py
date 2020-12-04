# Python script which translates my list of text prompts to json format
with open("text.txt") as f:
    read_data = f.read()
    read_data = read_data.split("\n")
    read_data = [prompt.split(":") for prompt in read_data]
    read_data = [
        f"[\"{pair[0]}\",\"{pair[1]}\"]" for pair in read_data]

with open("prompts.json", "w") as f:
    f.write("{\n\t\"prompts\" : [\n\t\t")
    f.write(',\n\t\t'.join(read_data))
    f.write("\n\t]\n}")
