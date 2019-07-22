import numpy

def levenshtein_distance(a: str, b: str, sim_chars = []):
    def calc_cost(char_a, char_b, sim_chars):
        if char_a == char_b:
            return 0
        else:
            for chars in sim_chars:
                if chars[1] == char_a and chars[2] == char_b:
                    return float(chars[0])
                if chars[1] == char_b and chars[2] == char_a:
                    return float(chars[0])
            return 1

    d = numpy.zeros((len(a) + 1, len(b) + 1))

    for i in range(1, len(a) + 1):
        d[i][0] = i
    for j in range(1, len(b) + 1):
        d[0][j] = j

    for j in range(1, len(b) + 1):
        for i in range(1, len(a) + 1):
            d[i][j] = min(
                d[i-1][j] + 1,
                d[i][j-1] + 1,
                d[i-1][j-1] + (calc_cost(a[i-1], b[j-1], sim_chars))
            )

    return d[-1][-1]


if __name__ == "__main__":
    import time
    start = time.time()
    for x in range(0, 207):
        dist = levenshtein_distance("helloworld", "helloxorld")
    time_elapsed = time.time() - start
    print(f'Time Elapsed: {time_elapsed} seconds')
    print(f'Levenshtein Distance: {dist}')
