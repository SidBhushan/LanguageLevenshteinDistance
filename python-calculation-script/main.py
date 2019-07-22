import csv
import swadesh
import time

if __name__ == "__main__":
    start_time = time.time()
    languages = ["EN", "LA", "CA", "ES", "IT", "EO", "DE", "NL", "EL", "GRC", "HI"]
    combinations = []
    for i in range(0, len(languages)):
        for j in range(i, len(languages)):
            combinations.append([languages[i], languages[j]])
    with open("output.csv", "w") as csv_file:
        csv_writer = csv.writer(csv_file)
        for combination in combinations:
            dist = swadesh.SwadeshComparison(combination[0], combination[1]) \
                .calc_levenshtein_distance()
            row = [combination[0], combination[1], dist]
            print(row)
            csv_writer.writerow(row)
    time_elapsed = time.time() - start_time
    print(f'Time taken: {time_elapsed} seconds')
